import './App.css';
import React, { useEffect, useState } from 'react';
import {Button, EditableText,InputGroup,Toaster} from '@blueprintjs/core'

const AppToaster = Toaster.create({
  position:"top"
})


function App() {

  const [users, setUsers] = useState([]);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=>response.json())
    .then((json)=>setUsers(json))
  },[]);

  function submit (){
    const newname = name.trim();
    const newemail = email.trim();
    const newwebsite = website.trim();

    if (newname && newemail && newwebsite) {
      fetch('https://jsonplaceholder.typicode.com/users',
      {
        method: "POST",
        body: JSON.stringify(
          {
            name:newname,
            email:newemail,
            website:newwebsite
          }
        ),
        headers: {
          "Content-Type":"application/json; charset=UTF-8"
        }

      })
      .then((response)=>response.json())
      .then(data=>{
        setUsers([...users,data]);
        AppToaster.show(
          {
            message: "User Added Successfully",
            intent:"success",
            timeout:3000
          }
        )
        setName("")
        setEmail("")
        setWebsite("")
      })
      
    }

  };
  function onChangeHandler(id,key,value){
    setUsers((users)=>{
      return users.map((user)=>{ 
        return user.id==id?{...user,[key]:value}:user;
      })

    })

  };
  function updateUser(id){
    const user = users.find((user)=>user.id===id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type":"application/json; charset=UTF-8"
        }

      })
      .then((response)=>response.json())
      .then(data=>{
        AppToaster.show(
          {
            message: "User Updated Successfully",
            intent:"success",
            timeout:3000
          }
        )

      })
  };
  function deleteUser(id){

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "DELETE",
      })
      .then((response)=>response.json())
      .then(data=>{
        setUsers((users)=>{
          return users.filter((user)=> user.id !== id)
        }
          
        )
        AppToaster.show(
          {
            message: "User Deleted Successfully",
            intent:"success",
            timeout:3000
          }
        )

      })
  }
  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
          {users.map(user=>
          <tr key={user.id}>
          <td>{user.id}</td>
          <td><EditableText value={user.name}/></td>
          <td><EditableText value={user.email} onChange={value=>onChangeHandler(user.id, "email",value)}/></td>
          <td><EditableText value={user.website} onChange={value=>onChangeHandler(user.id, "website",value)}/></td>
          <td>
            <Button intent='primary' onClick={()=>updateUser(user.id)}>Update</Button>
            &nbsp;
            <Button intent='danger' onClick={()=>deleteUser(user.id)}>Delete</Button>
          </td>
          </tr>

          )}

        </tbody>
        <tfoot>
              <tr>
                <td></td>
                <td>
                  <InputGroup
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  placeholder='Enter name'
                  />
                </td>
                <td>
                  <InputGroup
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder='Enter Email'
                  />
                </td>
                <td>
                  <InputGroup
                  value={website}
                  onChange={(e)=>setWebsite(e.target.value)}
                  placeholder='website name'
                  />
                </td>
                <td>
                  <Button intent='success' onClick={submit}>Add User</Button>
                </td>
              </tr>
        </tfoot>
      </table>

    </div>
  );
}

export default App;
