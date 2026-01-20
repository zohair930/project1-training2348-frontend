import React, { useEffect, useState } from 'react'
import { Pet } from '../util/types'
import axios from 'axios'
import base_url from '../util/url'

import styles from "./Pets.module.css";
import { useNavigate } from 'react-router-dom';

export default function Pets() {

  // useNavigate() returns a function that can be used to programatically navigate to a different route
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([])

  // In this useEffect, we retrieve the pets from the back-end API call:
  useEffect(() => {
    axios.get(`${base_url}/pets`)
      // set the state on success:
      .then(response => setPets(response.data))
      // otherwise, print the error:
      .catch(error => console.error(error));
  }, [])

  // Whenever we click a pet's button, we want to go to their page:
  const petClickHandler = (id:number) => {
    // navigate to localhost:3000/pets/id
    navigate(`/pets/${id}`)
  }

  return (
    // Set up our basic table structure:
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>ID</th>
            <th>Name</th>
            <th>Species</th>
            <th>Food</th>
            <th>Adopt</th>
          </tr>
        </thead>
        <tbody>
          {/* For each pet in the array, render a table row (using map) */}
          {pets.map((pet) => (
            <tr key={pet.id} className={styles.row}>
              <td className={styles.Cell}>{pet.id}</td>
              <td className={styles.cell}>{pet.name}</td>
              <td className={styles.cell}>{pet.species}</td>
              <td className={styles.cell}>{pet.food}</td>
              {/* Whenever we click the button, call the petClickHandler function, passing in the current pet's id as the parameter: */}
              <td><button onClick = {() => petClickHandler(pet.id!)} className={styles.btn}>View Pet</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
