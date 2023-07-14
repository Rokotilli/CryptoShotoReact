import React, { Component } from 'react';
import axios from '../../../node_modules/axios/index';

export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = { news: [], loading: true };
    }

    componentDidMount() {
        this.populateNews();
    }

    static renderNews(news) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <tbody>
                    {news.map(news =>
                        <tr key={news.id}>
                            <td>{news.title}</td>
                            <td>{news.text}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : News.renderNews(this.state.news);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateNews() {
        try {
            const response = await axios.get('news/GetAllNews');
            this.setState({ news: response.data, loading: false });
        }
        catch (err) {
            console.log(err);
        }
    }
}


