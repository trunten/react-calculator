import React, {Component} from 'react';
import Button from './components/button';
import './css/style.css';

class App extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            current: '0',
            previous: [],
            resetNext: false
        };

    }

    reset = () => {
        this.setState({current: '0', previous: []});
    }

    backspace = () => {
        let current = this.state.current;
        if (current === 'NaN' || this.state.resetNext) { current = '0' }
        if (current.length > 1) {
            current = current.substring(0,current.length - (current.charAt(current.length-2) === '.'? 2 : 1))
            
        } else {
            current = '0';
        }
        this.setState({current, resetNext: false});
    }

    addToCurrent = (symbol) => {
        if (this.state.current === 'NaN') { 
            if (isNaN(symbol)) {
                this.reset();
            } else {
                this.setState({current: symbol})
            }
        } else if (['+','-','x','÷'].includes(symbol)) {
            this.state.previous.push(this.state.current + (this.state.current.charAt(this.state.current.length-1) === '.' ? '0' : '' ) + ' ' + symbol)
            this.setState({current: '0', resetNext: false});
        } else if ((this.state.current === '0' && symbol !== '.') || this.state.resetNext) {
            if (symbol !== '.') {
                this.setState({current: symbol, resetNext: false})
            } else {
                this.setState({current: '0.', resetNext: false});    
            }
        } else if (!this.state.current.includes('.') || symbol !=='.') {
            this.setState({current: this.state.current + symbol});
        }
    }

    

    calculateResult = () => {
        if (this.state.previous.length > 0) {
            let expression = ''; 
            this.state.previous.forEach((ex) => {
                expression += ex.replace('x','*').replace('÷','/');
            })
            expression = (expression + this.state.current).replace('--','+');
            let result = 0;
            try {
                // eslint-disable-next-line
                result = eval(expression);
                if (!isFinite(result)) result = NaN;
            } catch (error) {
                result = NaN;
            }
            this.setState({current: String(result), previous: [], resetNext: true})
        }
    }

    plusMinus = () => {
        if (this.state.current !== 'NaN') {
            // eslint-disable-next-line
            this.setState({current: String(eval('-1*' + this.state.current))});
        } else {
            this.reset();
        }
    }

    render() {
        const buttons = [
            {symbol: 'CE', cols: 2, action: this.reset},
            {symbol: '⌫', cols: 1, action: this.backspace},
            {symbol: '÷', cols: 1, action: this.addToCurrent},
            {symbol: '7', cols: 1, action: this.addToCurrent},
            {symbol: '8', cols: 1, action: this.addToCurrent},
            {symbol: '9', cols: 1, action: this.addToCurrent},
            {symbol: 'x', cols: 1, action: this.addToCurrent},
            {symbol: '4', cols: 1, action: this.addToCurrent},
            {symbol: '5', cols: 1, action: this.addToCurrent},
            {symbol: '6', cols: 1, action: this.addToCurrent},
            {symbol: '-', cols: 1, action: this.addToCurrent},
            {symbol: '1', cols: 1, action: this.addToCurrent},
            {symbol: '2', cols: 1, action: this.addToCurrent},
            {symbol: '3', cols: 1, action: this.addToCurrent},
            {symbol: '+', cols: 1, action: this.addToCurrent},
            {symbol: '±', cols: 1, action: this.plusMinus},
            {symbol: '0', cols: 1, action: this.addToCurrent},
            {symbol: '.', cols: 1, action: this.addToCurrent},
            {symbol: '=', cols: 1, action: this.calculateResult},
        ];


        return (
            <div className='App'>
                {this.state.previous.length > 0 ? 
                    //<div className='previous'>{this.state.previous[this.state.previous.length-1]}</div>
                    <div className='previous'>{this.state.previous.join(' ')}</div>
                : null}
                <input className='result' type='text' value={this.state.current} readOnly />

                {buttons.map((btn, i) => {
                    return <Button key={i} symbol={btn.symbol} cols={btn.cols} action={(symbol) => btn.action(symbol)} />
                })}
            </div>
        );
    }
}

export default App;