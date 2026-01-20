import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Person, Pet } from '../util/types';
import axios from 'axios';
import base_url from '../util/url';
import styles from "./PetItem.module.css";
import { useAuth } from '../hooks/useAuth';

export default function AddPet() {
  // extract id field from route path:
  const id = useParams().id;
  // set up state:
  const [pet, setPet] = useState<Pet>({name: '', food: '', species:''});
  // useNavigate() returns a function that lets us programmatically redirect:
  const navigate = useNavigate();
  
  // retrieve the user from our custom hook:
  const {user} = useAuth();



  // in the useEffect, fetch the pet data from the API:
  useEffect(() => {
    axios.get(`${base_url}/pets/${id}`)
      .then(response => setPet(response.data))
      .catch(error => console.error(error))
  }, [id]);

  // Standard onChangeHandler:
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!pet) return;
    setPet({
      ...pet,
      [event.target.name]: event.target.value
    })
  }

  const onInsertHandler = () => {
    if (user?.id !== 1) {
      alert("Must be logged in as shelter to add pet");
      return;
    }
    axios.post(`${base_url}/pets`, pet)
      // navigate to main page after complete:
      .then(response => navigate('/'))
      .catch(error => console.error(error))

  }

  return <div className={styles.wrapper}>
      <h2 className={styles.title}>Add Pet</h2>

      <form className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Pet Name</label>
          <input
            id="name"
            className={styles.input}
            onChange={onChangeHandler}
            name="name"
            value={pet.name}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="species">Species</label>
          <input
            id="species"
            className={styles.input}
            onChange={onChangeHandler}
            name="species"
            value={pet.species}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="food">Pet Food</label>
          <input
            id="food"
            className={styles.input}
            onChange={onChangeHandler}
            name="food"
            value={pet.food}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={(e) => {
              e.preventDefault();
              onInsertHandler();
            }}
          >
            Add New Pet
          </button>

        </div>
      </form>
    </div>
}
