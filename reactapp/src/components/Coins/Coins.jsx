import React, { Component } from 'react';
import axios from '../../../node_modules/axios/index';

export default class Coins extends Component {
    constructor(props) {
        super(props);
        this.state = { coins: [], loading: true };
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            this.populateCoins();
        }
        catch (err) {
            console.log(err);
        }
    }

    renderCoins(coins) {

        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <tbody>
                    {coins.map(coin =>
                        <tr key={coin.id}>
                            <td>{coin.name}</td>
                            <td>{coin.price}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderCoins(this.state.coins);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateCoins() {
        try {
            const response = await axios.get('/coin/GetAllCoins');
            this.setState({ coins: response.data, loading: false });
        }
        catch (err) {
            console.log(err);
        }
    }
}