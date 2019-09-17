import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

const App = () => {

  const [updateMemberId, setUpdateMemberId] = useState(0);
  const [updateTheMember, setUpdateTheMember] = useState({name: "", age: ""});
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState({name: "", age: ""});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log("USE EFFECT");

    getMembers();
  },[]);

  const  getMembers = async () => {
    try {
      setIsLoading(true);
      const {data} = await axios.get('http://localhost:5000/members');
      setMembers(data);
    }
    catch (err) {
      // TODO: 
    }
    finally {
      setIsLoading(false);
    }
  } 

  const deleteMember = async (id) => {
    console.log(id);
    const prevMembers = [...members];
    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
    try {
      await axios.delete(`http://localhost:5000/members/${id}`);
    }
    catch (err) {
      setMembers(prevMembers);
    }
  }

  const eventHandlerAdd = event => {
    const { name, value } = event.currentTarget;
    setMember(prevState => ({ 
      ...prevState, [name]: value }));
  }

  const eventHandlerUpdate = event => {
    const { name, value } = event.currentTarget;
    setUpdateTheMember(prevState => ({ 
      ...prevState, [name]: value }));
  }

  const addMember = async () => {
    try{
      const {data : createdMember} = await axios.post('http://localhost:5000/members', member);
      setMembers(prevState => [...prevState, createdMember]);
      setMember({name: "", age: ""});
    }
    catch (err) {
      // TODO: 
    }
  }
  const updateMember = async () => {
    try{
      const {data : updated} = await axios.put(`http://localhost:5000/members/${updateTheMember.id}`, updateTheMember);
      console.log(updated);
      // setMembers(prevState => [...prevState, createdMember]);
      getMembers();
      setUpdateMemberId(0);
      setUpdateTheMember({});
    }
    catch (err) {
      // TODO: 
    }
  }

  const setMemberForUpdate = member => {
    setUpdateMemberId(member.id);
    setUpdateTheMember(member);
  }

  return (
    <div className="App">
        <input type="text" name="name" value={member.name} onChange={ eventHandlerAdd} />
        <input type="text" name="age" value={member.age} onChange={ eventHandlerAdd} />
        <button type="button" onClick={addMember}>Add</button>
      <div>{member.name} - {member.age}</div>
      <ul>
      {isLoading && <div className="lds-ripple"><div></div><div></div></div>}  
      {members && members.map( m => (
        <div key={m.name + m.age}>
        { updateMemberId !== m.id ? (
  
          <li>
            <strong>ID:</strong> {m.id} - {' '}
            <strong>Member:</strong> {m.name} - {' '}
            <strong>Age:</strong> {m.age}
            <button onClick={() => setMemberForUpdate(m)}>Update</button>
            <button onClick={() => deleteMember(m.id)}>Delete</button>
          </li>
        )
        : 
        (
          <li>
            <input type="text" name="name" value={updateTheMember.name} onChange={ eventHandlerUpdate} />
            <input type="text" name="age" value={updateTheMember.age} onChange={ eventHandlerUpdate} />
            <button type="button" onClick={updateMember}>Update</button>
          </li>
        )}
        </div>
        )
      )}
      </ul>
    </div>
  );
}

export default App;
