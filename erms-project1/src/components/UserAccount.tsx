import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Ticket, Account, TicketStatus } from '../util/types';
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
  let id = user?.userId;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState<Ticket>({
    description: "test",
    price: 0,
    status: TicketStatus.PENDING,
  });

  
    const fetchTickets = async () => {
      try {
        if (!id) {
          console.error("No accountId on user. Cannot fetch tickets.");
          setTickets([]);
          return;
        }
        const response = await axios.get(`${base_url}/accounts/${id}/tickets`);
        setTickets(response.data);
      } catch (error) {
        console.error(error);
        alert("Could not load tickets");
      }
    };
    const onCreateTicket = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!id) {
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
        await axios.post(`${base_url}/accounts/${id}/tickets`, formData);

        
        setFormData({ description: "", price: 0, status: TicketStatus.PENDING });
        setShowCreateForm(false);
        await fetchTickets();

        alert("Ticket submitted!");
      } catch (error) {
        console.error(error);
        alert("Could not submit ticket");
      }
  };


  // in the useEffect, fetch the account data from the API:
  useEffect(() => {
    if(id){
      console.log("Fetching account for user id:", id);
      console.log(`${base_url}/accounts/${id}`);
    axios.get(`${base_url}/accounts/${id}`)
      .then(response => { setAccount(response.data); console.log(response.data);})
      .catch(error => console.error(error))

    fetchTickets();
    }
  }, [id]);

  // Standard onChangeHandler:
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!account) return;
    setAccount({
      ...account,
      [event.target.name]: event.target.value
    })
  }

  return account ? (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Account Information</h2>
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
          {id ? "No tickets yet." : "No accountId found on user."}
        </p>
      )}
    </div>
        </div>
      </form>
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
    </div>
  ) : (
    <h1 className={styles.loading}>Loading</h1>
  );
}
