import React, { ChangeEventHandler, useState, useContext } from 'react'
import { AuthContext, Person } from '../util/types';
import styles from './PetItem.module.css';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [userFormData, setUserFormData] = useState<Person>({ name: 'Shaggy', password: 'loveScoob' });

  // retrieve login function from our custom hook:
  const {login} = useAuth();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value
    })
  }

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userFormData.password) login(userFormData.name, userFormData.password);

  }



  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={styles.input}
            name="name"
            value={userFormData.name}
            onChange={onChangeHandler}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={styles.input}
            type="password"
            name="password"
            value={userFormData.password}
            onChange={onChangeHandler}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
          >
            Log In
          </button>

        </div>
      </form>

    </div>

  )
}
