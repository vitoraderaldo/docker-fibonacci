import React, { Component} from 'react'
import axios from 'axios'

class Fib extends Component {
    state = {
        seenIndexes: [],
        history: {},
        index: ''
    }

    componentDidMount() {
        this.fetchHistory()
        this.fetchIndexes()
    }

    async fetchIndexes() {
        const indexes = await axios.get('/api/values/all')
        this.setState({seenIndexes: indexes.data})
    }    

    async fetchHistory() {
        const history = await axios.get('/api/values/current')
        this.setState({history: history.data})
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        await axios.post('/api/calculate', {
            index: this.state.index
        })
        this.setState({index: ''})
    }

    renderSeenIndexes() {
        return this.state.seenIndexes.map( ({number}) => number).join(', ')
    }

    renderHistory() {
        const entries = [];
        for (let key in this.state.history) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.history[key]}
                </div>
            )
        }
        return entries        
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input 
                        value={this.state.index}
                        onChange={event => this.setState({index: event.target.value})}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated values</h3>
                {this.renderHistory()}

            </div>
        )
    }
}

export default Fib