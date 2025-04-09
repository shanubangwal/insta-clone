import { Input } from './ui/input';
import React, { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { CircleArrowDown, CircleArrowUp, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

export default function Login() {
    const [input,setInput] = useState({
        email: "",
        password: ""
    })

    const [loading,setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const changeEventHandler = (e) => {
        setInput({...input,[e.target.name]: e.target.value})
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login',input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if(res.data.success){
              navigate('/');
              dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message);
                setInput({
                  email: "",
                  password: ""
                })
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
      if(user){
        navigate("/")
      }
    },[])

  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center" >


        <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 rounded-2xl bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500">
          <div className="my-4">
          <h1 className='my-8 pl-3 font-bold text-3xl flex flex-row justify-center items-center text-white'>C<CircleArrowDown className='w-10 h-10'  /> NNECT T<CircleArrowUp  className='w-10 h-10' /> </h1>
            <p>Login now to connect with the world!</p>
          </div>

          <div>
            <Label className="">Email</Label>
            <Input
              type="text"
              placeholder="Enter your Email"
              name="email"
              required
              value={input.email}
              onChange={changeEventHandler}
              className="focus-visible:ring-transparent my-2 bg-white text-black"
            />
          </div>
          <div>
            <Label className="">Password</Label>
            <Input
              type="text"
              placeholder="Enter your password"
              name="password"
              required
              value={input.password}
              onChange={changeEventHandler}
              className="focus-visible:ring-transparent my-2 bg-white text-black"
            />
          </div>
          {
            loading ? (<Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>):(
              <Button type='submit' >Login</Button>
            )
          }
          <span>Doesn't have an Account ? <Link className="text-white" to="/signup">Signup from here</Link></span>
        </form>
      </div>
    </>
  );
    }