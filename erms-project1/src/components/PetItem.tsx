import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Person, Pet } from '../util/types';
import axios from 'axios';
import base_url from '../util/url';
import styles from "./PetItem.module.css";

export default function PetItem() {
  // extract id field from route path:
  const id = useParams().id;
  // set up state:
  const [pet, setPet] = useState<Pet | null>(null);
  // useNavigate() returns a function that lets us programmatically redirect:
  const navigate = useNavigate();
  // receive context:
  const ctx = useContext(AuthContext);



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

  // OnDeleteHandler, sends a DELETE request to our API:
  const onDeleteHandler = () => {
    // validation:
    if (!pet?.id) {
      console.error('pet id is null');
      return;
    }
    axios.delete(`${base_url}/pets/${pet.id}`)
      // navigate to main page after complete:
      .then(response => navigate('/'))
      .catch(error => console.error(error))

  }

  // OnUpdateHandler, send a PUT request to our API
  const onUpdateHandler = () => {
    // validation:
    if (!pet?.id) {
      console.error('pet id is null');
      return;
    }
    axios.put(`${base_url}/pets`, pet)
      // navigate to main page after complete:
      .then(response => navigate('/'))
      .catch(error => console.error(error))
  }

  // OnUpdateHandler, send a PUT request to our API
  const onAdoptHandler = async () => {
    // validation:
    if (!pet?.id) {
      console.error('pet id is null');
      return;
    }
    let owner:Person = (await axios.get(`${base_url}/pets/${pet.id}/owner`)).data;
    console.log(owner);
    if(owner.id !== 1) alert("Pet is already adopted");
    else if(!(ctx?.user)) {
      alert("Must be logged in");
      return;
    }
    else {
      let ownerId = ctx?.user.id;
      try {
        await axios.put(`${base_url}/persons/${ownerId}/pets/${pet.id}`);
      } catch (error) {
        console.error(error);
      }
      alert("Pet adopted!");
      navigate('/');
      
    }
  }

  return pet ? (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Edit Pet</h2>

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
              onUpdateHandler();
            }}
          >
            Update
          </button>

          <button
            type="button"
            className={`${styles.button} ${styles.danger}`}
            onClick={(e) => {
              e.preventDefault();
              onDeleteHandler();
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.danger}`}
            onClick={(e) => {
              e.preventDefault();
              onAdoptHandler();
            }}
          >
            Adopt
          </button>
        </div>
      </form>
    </div>
  ) : (
    <h1 className={styles.loading}>Loading</h1>
  );
}
