import React, { Component } from 'react';
import axios from '../node_modules/axios/index';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = { coins: [], loading: true };
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    renderForecastsTable(coins) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                {coins.map(coin =>
                    <tr key={coin.id}>
                        <td>{coin.name}</td>
                        <td>{coin.price}</td>
                    </tr>
                )}
            </table>
        );
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : App.renderForecastsTable(this.state.coins);

        return (
            <div>
                <h1 id="tabelLabel" >Coins</h1>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        try {
            const response = await axios.get('coin/GetAllCoins');
            this.setState({ coins: response.data, loading: false });
        }
        catch (err) {
            console.log(err);
        }
    }
}

       
       