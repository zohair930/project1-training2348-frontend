import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Person, Account } from '../util/types';
import axios from 'axios';
import base_url from '../util/url';
import styles from "./PetItem.module.css";
import { useAuth } from '../hooks/useAuth';

export default function UserAccount() {
  // set up state:
  const [account, setAccount] = useState<Account | null>(null);
  // useNavigate() returns a function that lets us programmatically redirect:
  const navigate = useNavigate();
  // receive context:
  const ctx = useContext(AuthContext);
  const {user} = useAuth();
    // extract id field from route path:
  const id = user?.id;



  // in the useEffect, fetch the account data from the API:
  useEffect(() => {
    console.log("Fetching account with id: " + id);
    console.log(`${base_url}/accounts/${id}`);
    axios.get(`${base_url}/accounts/${id}`)
      .then(response => { setAccount(response.data); console.log(response.data);})
      .catch(error => console.error(error))
  }, [id]);

  // Standard onChangeHandler:
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!account) return;
    setAccount({
      ...account,
      [event.target.name]: event.target.value
    })
  }

  // OnDeleteHandler, sends a DELETE request to our API:
  const onDeleteHandler = () => {
    // validation:
    if (!account?.id) {
      console.error('account id is null');
      return;
    }
    axios.delete(`${base_url}/accounts/${account.id}`)
      // navigate to main page after complete:
      .then(response => navigate('/'))
      .catch(error => console.error(error))

  }

  // OnUpdateHandler, send a PUT request to our API
  const onUpdateHandler = () => {
    // validation:
    if (!account?.id) {
      console.error('account id is null');
      return;
    }
    axios.put(`${base_url}/accounts`, account)
      // navigate to main page after complete:
      .then(response => navigate('/'))
      .catch(error => console.error(error))
  }

  // OnUpdateHandler, send a PUT request to our API
  const onAdoptHandler = async () => {
    // validation:
    if (!account?.id) {
      console.error('account id is null');
      return;
    }
    let owner:Person = (await axios.get(`${base_url}/accounts/${account.id}`)).data;
    console.log(owner);
    if(owner.id !== 1) alert("account is already adopted");
    else if(!(ctx?.user)) {
      alert("Must be logged in");
      return;
    }
    else {
      let ownerId = ctx?.user.id;
      try {
        await axios.put(`${base_url}/users/${ownerId}/accounts/${account.id}`);
      } catch (error) {
        console.error(error);
      }
      alert("account created!");
      navigate('/');
      
    }
  }

  return account ? (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Create account</h2>

      <form className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Account Balance</label>
          <input
            id="name"
            className={styles.input}
            onChange={onChangeHandler}
            name="name"
            value={account.balance}
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
        </div>
      </form>
    </div>
  ) : (
    <h1 className={styles.loading}>Loading</h1>
  );
}
