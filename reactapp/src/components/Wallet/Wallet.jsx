import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkLogged } from '../../Functions/Functions';
import { Navigate } from 'react-router';
import { ThreeDots } from 'react-loader-spinner';

const Wallet = () => {
    const [wallets, setWallets] = useState([]);
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [countToBuy, setCountToBuy] = useState({});
    const [countToSell, setCountToSell] = useState({});

    useEffect(() => {
        const check = async () => {
            try {
                const isLoggedIn = await checkLogged();

                if (isLoggedIn) {
                    await populateWallet();
                    setIsLoggedIn(true);
                }

                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        check();
    }, []);

    const handleBuyCoin = async (event, coinId) => {
        event.preventDefault();
        const count = +countToBuy[coinId];

        try {
            axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
            const response = await axios.post('/wallet/BuyCoin', { coinId, count });
            delete axios.defaults.headers.common['xAuthAccessToken'];

            window.location.href = '/wallet';
        } catch (err) {
            console.log(err);
        }
    };

    const handleSellCoin = async (event, coinId) => {
        event.preventDefault();
        const count = +countToSell[coinId];

        try {
            axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
            const response = await axios.post('/wallet/SellCoin', { coinId, count });
            delete axios.defaults.headers.common['xAuthAccessToken'];

            window.location.href = '/wallet';
        } catch (err) {
            console.log(err);
        }
    };

    const handleChangeToBuy = (e, coinId) => {
        const value = e.target.value;
        setCountToBuy((prevCountToBuy) => ({
            ...prevCountToBuy,
            [coinId]: value,
        }));
    };

    const handleChangeToSell = (e, coinId) => {
        const value = e.target.value;
        setCountToSell((prevCountToSell) => ({
            ...prevCountToSell,
            [coinId]: value,
        }));
    };

    const renderCoins = () => {
        if (coins.length === 0) {
            return (
                <div>
                    <h3>Available coins:</h3>
                    <div>Empty</div>
                </div>
            );
        }

        return (
            <>
                <h3>Available coins:</h3>
                {coins.map((coin) => (
                    <div key={coin.id}>
                        {coin.name} - ${coin.price}
                        <form onSubmit={(e) => handleBuyCoin(e, coin.id)}>
                            <label>
                                Buy this:
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    pattern="\d*"
                                    placeholder="Count:"
                                    name={`countToBuy-${coin.id}`}
                                    value={countToBuy[coin.id] || ''}
                                    onChange={(e) => handleChangeToBuy(e, coin.id)}
                                    required
                                />
                            </label>
                            <button type="submit" className="AllButton">Buy</button> <br /><br />
                        </form>
                    </div>
                ))}
            </>
        );
    };

    const renderWallet = () => {
        if (!isLoggedIn) {
            return <Navigate to="/login" />;
        }

        if (wallets.length === 0) {
            return (
                <div>
                    <h3>Your coins:</h3>
                    <div>Empty</div>
                </div>
            );
        }

        return (
            <>
                <h3>Your coins:</h3>
                {wallets.map((wallet) => (
                    <div key={wallet.coinId}>
                        {wallet.coinName} - {wallet.count}
                        <form onSubmit={(e) => handleSellCoin(e, wallet.coinId)}>
                            <label>
                                Sell this:
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    pattern="\d*"
                                    placeholder="Count:"
                                    name={`countToSell-${wallet.coinId}`}
                                    value={countToSell[wallet.coinId] || ''}
                                    onChange={(e) => handleChangeToSell(e, wallet.coinId)}
                                    required
                                />
                            </label>
                            <button type="submit" className="AllButton">Sell</button> <br /><br />
                        </form>
                    </div>
                ))}
            </>
        );
    };

    const populateWallet = async () => {
        try {
            axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
            const response = await axios.get('/wallet/GetAllWallets');
            delete axios.defaults.headers.common['xAuthAccessToken'];

            const response1 = await axios.get('/coin/GetAllCoins');
            setCoins(response1.data);
            setWallets(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    let walletsElement = loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} ><ThreeDots color="#00BFFF" height={80} width={80} /></div> : renderWallet();
    let coinsElement = loading ? <></> : renderCoins();

    return (
        <div>
            {walletsElement}
            {coinsElement}
        </div>
    );
};

export default Wallet;