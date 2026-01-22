import React, { useState } from 'react'
import { User, UserType } from '../util/types';
import styles from './PetItem.module.css';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [userFormData, setUserFormData] = useState<User>({ username: '', password: '', userType: UserType.EMPLOYEE});

  // retrieve login function from our custom hook:
  const {register} = useAuth();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value
    })
  }

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userFormData.password) register(userFormData.username, userFormData.password, userFormData.userType);

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
            name="username"
            value={userFormData.username}
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

          <div className={styles.field}>
          <label className={styles.label} htmlFor="userType">
            Manager
          </label>
          <input
            id="userType"
            type="radio"
            className={styles.input}
            name="userType"
            value={UserType.MANAGER}
            onChange={onChangeHandler}
          />
        </div>
          <div className={styles.field}>
          <label className={styles.label} htmlFor="userType">
            Employee
          </label>
          <input
            id="userType"
            type="radio"
            className={styles.input}
            name="userType"
            value={UserType.EMPLOYEE}
            defaultChecked
            onChange={onChangeHandler}
          />
        </div>
        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
          >
            Register
          </button>

        </div>
      </form>

    </div>

  )
}
