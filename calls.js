let register = async ()=>{
    let data = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    console.log(data)
    let response = await fetch('http://localhost:3000/users/register', {
                                    method: "POST",
                                    mode:"cors",
                                    cache:'no-cache',
                                    headers:{
                                        'Accept':'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                }
                                    )
    
    let registerResult = await response.json()
    console.log(registerResult)
}


//login
let login = async ()=>{
    let data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    let headerObj = new headers({
        'Accept':'application/json',
        'Content-Type': 'application/json'
    })
    let response = await fetch('http://localhost:3000/users/login' ,{
                                        method: "POST",
                                        mode:"cors",
                                        cache:'no-cache',
                                        headers:headerObj,
                                        body: JSON.stringify(data)
                                    }
                                    )
    
    let loginResult = await response.json()
    console.log(loginResult)
}