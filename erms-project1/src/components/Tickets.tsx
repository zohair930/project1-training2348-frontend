// import React, { useEffect, useState } from 'react'
// import { Ticket } from '../util/types'
// import axios from 'axios'
// import base_url from '../util/url'

// import styles from "./Tickets.module.css";
// import { useNavigate } from 'react-router-dom';

// export default function Tickets() {

//   // useNavigate() returns a function that can be used to programatically navigate to a different route
//   const navigate = useNavigate();

//   const [tickets, setTickets] = useState<Ticket[]>([])

//   // In this useEffect, we retrieve the tickets from the back-end API call:
//   useEffect(() => {
//     axios.get(`${base_url}/tickets`)
//       // set the state on success:
//       .then(response => setTickets(response.data))
//       // otherwise, print the error:
//       .catch(error => console.error(error));
//   }, [])

//   // Whenever we click a pet's button, we want to go to their page:
//   const petClickHandler = (id:number) => {
//     // navigate to localhost:3000/tickets/id
//     // navigate(`/tickets/${id}`)
//   }

//   return (
//     // Set up our basic table structure:
//     <div className={styles.wrapper}>
//       <table className={styles.table}>
//         <thead>
//           <tr className={styles.headerRow}>
//             <th>ID</th>
//             <th>Description</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* For each ticket in the array, render a table row (using map) */}
//           {tickets.map((ticket) => (
//             <tr key={ticket.id} className={styles.row}>
//               <td className={styles.Cell}>{ticket.id}</td>
//               <td className={styles.cell}>{ticket.description}</td>
//               <td className={styles.cell}>{ticket.status}</td>
//               {/* Whenever we click the button, call the petClickHandler function, passing in the current pet's id as the parameter: */}
//               <td><button onClick = {() => petClickHandler(ticket.id!)} className={styles.btn}>View Ticket</button></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import base_url from "../util/url";
import styles from "./Pets.module.css";
import { useAuth } from "../hooks/useAuth";
import { Ticket } from "../util/types";

type CreateTicketDTO = {
  description: string;
  price: number;
};

export default function Tickets() {
  const { user } = useAuth();

  
  const accountId = user?.account?.id;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState<CreateTicketDTO>({
    description: "",
    price: 0,
  });

  const fetchTickets = async () => {
    try {
      if (!accountId) {
        console.error("No accountId on user. Cannot fetch tickets.");
        setTickets([]);
        return;
      }
      const response = await axios.get(`${base_url}/accounts/${accountId}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error(error);
      alert("Could not load tickets");
    }
  };

  
  useEffect(() => {
    fetchTickets();
    
  }, [accountId]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const onCreateTicket = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!accountId) {
      alert("No account found for this user yet.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    try {
      await axios.post(`${base_url}/accounts/${accountId}/tickets`, formData);

      
      setFormData({ description: "", price: 0 });
      setShowCreateForm(false);
      await fetchTickets();

      alert("Ticket submitted!");
    } catch (error) {
      console.error(error);
      alert("Could not submit ticket");
    }
  };

  return (
    <div className={styles.wrapper}>
      
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button className={styles.btn} onClick={fetchTickets}>
          View Tickets
        </button>

        <button
          className={styles.btn}
          onClick={() => setShowCreateForm((prev) => !prev)}
        >
          {showCreateForm ? "Close Form" : "Create Ticket"}
        </button>
      </div>

    
      {showCreateForm && (
        <form onSubmit={onCreateTicket} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={onChangeHandler}
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={onChangeHandler}
            />

            <button type="submit" className={styles.btn}>
              Submit
            </button>
          </div>
        </form>
      )}

      
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>ID</th>
            <th>Description</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className={styles.row}>
              <td className={styles.cell}>{ticket.id}</td>
              <td className={styles.cell}>{ticket.description}</td>
              <td className={styles.cell}>{ticket.price}</td>
              <td className={styles.cell}>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {tickets.length === 0 && (
        <p style={{ marginTop: 12 }}>
          {accountId ? "No tickets yet." : "No accountId found on user."}
        </p>
      )}
    </div>
  );
}
