import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, Pet } from '../util/types'
import axios from 'axios'
import base_url from '../util/url'

import styles from "./Pets.module.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdoptedPets() {
  const navigate = useNavigate();

  const {user} = useAuth();

  const [pets, setPets] = useState<Pet[]>([])

  // In this useEffect, we retrieve the pets from the back-end API call:
  useEffect(() => {
    // navigate to home page if not logged in:
    if (!user) navigate('/');

    else {

      axios.get(`${base_url}/persons/${user?.id}/pets`)
        // set the state on success:
        .then(response => setPets(response.data))
        // otherwise, print the error:
        .catch(error => console.error(error));
    }
  }, [])

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
