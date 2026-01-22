import React, { useEffect, useState } from 'react'
import { Ticket } from '../util/types'
import axios from 'axios'
import base_url from '../util/url'

import styles from "./Tickets.module.css";
import { useNavigate } from 'react-router-dom';

export default function Tickets() {

  // useNavigate() returns a function that can be used to programatically navigate to a different route
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([])

  // In this useEffect, we retrieve the tickets from the back-end API call:
  useEffect(() => {
    axios.get(`${base_url}/tickets`)
      // set the state on success:
      .then(response => setTickets(response.data))
      // otherwise, print the error:
      .catch(error => console.error(error));
  }, [])

  // Whenever we click a pet's button, we want to go to their page:
  const petClickHandler = (id:number) => {
    // navigate to localhost:3000/tickets/id
    // navigate(`/tickets/${id}`)
  }

  return (
    // Set up our basic table structure:
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* For each ticket in the array, render a table row (using map) */}
          {tickets.map((ticket) => (
            <tr key={ticket.id} className={styles.row}>
              <td className={styles.Cell}>{ticket.id}</td>
              <td className={styles.cell}>{ticket.description}</td>
              <td className={styles.cell}>{ticket.status}</td>
              {/* Whenever we click the button, call the petClickHandler function, passing in the current pet's id as the parameter: */}
              <td><button onClick = {() => petClickHandler(ticket.id!)} className={styles.btn}>View Ticket</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
