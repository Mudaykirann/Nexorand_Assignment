import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import Link from 'next/link';
import { UserAdd01Icon } from 'hugeicons-react';

export default function Home() {
    const [friends, setFriends] = useState([]);
    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchFriends() {
            try {
                const response = await axios.get('http://localhost:7000/api/user/v1/get-users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setFriends(response.data.data);
                } else {
                    console.error('Failed to fetch friends');
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        }

        if (token) fetchFriends();
    }, [token]); //  token


    let firstThreeFirends = friends.slice(0, 3);

    const handleClaimPoints = async (username) => {
        try {
            await axios.patch('http://localhost:7000/api/user/v1/claim-points', { username });

            const updatedFriends = await axios.get('http://localhost:7000/api/user/v1/get-users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFriends(updatedFriends.data.data);
        } catch (error) {
            console.error('Error claiming points', error);
        }
    };

    let totalPoints = 0;
    friends.forEach((friend) => {
        totalPoints += friend.Points;
    });
    return (
        <div>
            <section className=''>
                <div className='bg-blue-600 flex justify-between items-center py-4 px-4'>
                    <div className='total'>
                        <h2 className='text-white'>Today <br />${totalPoints}.00</h2>
                    </div>
                    <div className='leaderboard flex justify-center items-center gap-2'>
                        <Link href='/Leaderboard'>
                            <p className='hover:text-white'>LeaderBoard</p>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"}>
                            <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>
                </div>
                <div className='topthreefriends'>
                </div>
                <div className='friends mt-10 mx-12 sm:mx-4 flex flex-col bg-gray-200'>
                    {friends.length > 0 ? (
                        friends
                            .sort((a, b) => b.Points - a.Points)
                            .map((friend) => (
                                <div key={friend._id} className="flex  justify-between px-4 my-2 py-6 hover:bg-slate-300 cursor-pointer hover:text-blue-500 transition duration-300" onClick={() => handleClaimPoints(friend.username)}>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={12} height={12} color={"#00000"} fill={"none"}>
                                                <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </span>
                                        <p>{friend.firstName}</p>
                                    </div>
                                    <div>
                                        <p className='text-red-500'>Prize:${friend.Points}</p>
                                    </div>
                                    <div className='text-green-600'>{friend.Points}</div>
                                </div>
                            ))
                    ) : (
                        <p>No friends found</p>
                    )}
                </div>
            </section>

        </div>
    );
}