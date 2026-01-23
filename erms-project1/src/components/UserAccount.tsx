import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Ticket, Account, TicketStatus, UserType } from '../util/types';
import axios from 'axios';
import base_url from '../util/url';
import styles from "./PetItem.module.css";
import { useAuth } from '../hooks/useAuth';

export default function UserAccount() {
    // set up state:
    const [account, setAccount] = useState<Account>({ balance: 0, tickets: []});
    // useNavigate() returns a function that lets us programmatically redirect:
    const navigate = useNavigate();
    // receive context:
    const ctx = useContext(AuthContext);
    const {user} = useAuth();
      // extract id field from route path:
    let id = user?.userId;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [status, setStatus] = useState<TicketStatus>(TicketStatus.PENDING);
    const [owner, setOwner] = useState<Account>({balance: 0});
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [formData, setFormData] = useState<Ticket>({
      id: 0,
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
        if(user?.userType === UserType.EMPLOYEE){
            const response = await axios.get(`${base_url}/accounts/${id}/tickets`);
             console.log(response.data)
            setTickets(response.data);
        } else if(user?.userType === UserType.MANAGER){
            const response = await axios.get(`${base_url}/tickets`);
            console.log(response.data)
            setTickets(response.data);
        }
        
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

        
        setFormData({ description: "", price: 0 });
        setShowCreateForm(false);
        await fetchTickets();

        alert("Ticket submitted!");
      } catch (error) {
        console.error(error);
        alert("Could not submit ticket");
      }
  };

      const onUpdateTicket = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!id) {
        alert("No account found for this user yet.");
        return;
      }

      if (!formData.id || formData.id <= 0) {
        alert("Id must be greater than 0");
        return;
      }

      try {
        console.log("Updating ticket with id: " + formData.id + " to status: " + formData.status)
        // console.log(`${base_url}tickets/${formData.id}`)
          console.log(formData)
        await axios.patch(`${base_url}/accounts/${owner.id}/tickets/${formData.id}`, { status: formData.status });
        
        setFormData({ id: id, description: formData.description, price: formData.price, status: formData.status });
        setShowCreateForm(false);
        await fetchTickets();
        alert("Ticket updated!");
       
      } catch (error) {
        console.error(error);
        alert("Could not update ticket status");
      }
  };


  // in the useEffect, fetch the account data from the API:
  useEffect(() => {
    if(id){
      axios.get(`${base_url}/accounts/${id}`)
        .then(response => { setAccount(response.data)})
        .catch(error => console.error(error))
      fetchTickets();
    }
  }, [id, account?.balance]);

  // Standard onChangeHandler:
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("On change triggered")
    if (!account) return;
    setAccount({
      ...account,
      [event.target.name]: event.target.value
    })
    console.log(event.target.value)
    console.log(account)
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
    console.log(formData)
  }

   const onTicketIdChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("On ticket id change triggered")
    if (!account) return;

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
    let ticketOwner = await axios.get(`${base_url}/tickets/${event.target.value}`);
    setOwner(ticketOwner.data.account);
    console.log(formData)
    console.log("Owner: " + ticketOwner.data.account.user.username)
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    event.preventDefault();
    if (!account) return;
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
    console.log("Status" + event.target.value)
  }

  return account ? (
    <>
      {user?.userType === "MANAGER" ? (
          <div className={styles.wrapper}>
            <h2 className={styles.title}>Account Manager Information</h2>
            <div className={styles.field}>
            <button className={styles.btn} onClick={fetchTickets}>
              View All Tickets for All Accounts
            </button>
            <button
              className={styles.btn}
              onClick={() => setShowCreateForm((prev) => !prev)}>
                {showCreateForm ? "Close Form" : "Accept/Deny Reimbursement Requests"}
            </button>
          </div>
          
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className={styles.row}>
                    <td className={styles.cell}>{ticket.id}</td>
                    <td className={styles.cell}>{ticket.description}</td>
                    <td className={styles.cell}>{ticket.price}</td>
                    <td className={styles.cell}>{ticket.account?.user?.username}</td>
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
            {showCreateForm && (
              <form onSubmit={onUpdateTicket} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label className={styles.label} htmlFor="id">
                    Ticket ID
                  </label>
                  <input
                    name="id"
                    type="number"
                    placeholder="Ticket ID"
                    value={formData.id}
                    onChange={onTicketIdChange}
                  />
                  <label className={styles.label} htmlFor="status">
                    Status
                  </label>
                  <select name="status" value={formData.status} onChange={event => handleCategoryChange(event)}>
                              <option id="0" defaultChecked></option>
                              <option id="1" value={TicketStatus.DENIED}>Deny</option>
                              <option id="2" value={TicketStatus.APPROVED}>Approve</option>
                          </select>

                  <button type="submit" className={styles.btn}>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className={styles.wrapper}>
            <h2 className={styles.title}>Employee Account Information</h2>
            <div className={styles.field}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }} onChange={onChangeHandler}>
              Balance: {account.balance}
            </div>
            <button className={styles.btn} onClick={fetchTickets}>
              View Tickets
            </button>
            <button
              className={styles.btn}
              onClick={() => setShowCreateForm((prev) => !prev)}>
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
            {showCreateForm && (
              <form onSubmit={onCreateTicket} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label className={styles.label} htmlFor="description">
                    Description
                  </label>
                  <input
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={onChangeHandler}
                  />
                  <label className={styles.label} htmlFor="price">
                    Price
                  </label>
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
        )
    }
    </>
  ) : (
    <h1 className={styles.loading}>Loading</h1>
  );
}
