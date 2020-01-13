import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './TimerComponent.css';

/**
 * A component for wrapping a ProgressBar with some logic.
 */
class TimerComponent extends Component {
    state = {
        timeLeft: -1,
        time: -1,
        timerFinished: false,
    };

    /**
     * Sets the time to 10 times the amount provided, for making the visual smoother.
     */
    componentDidMount() {
        this.restart();
        this.setState({ time: this.props.time * 10 });
    }

    /**
     * Starts a timer firing every 100ms that decreases the time left. Every iteration fires
     * the onChange(time) prop, and when finished fires the onFinish() prop.
     */
    restart() {
        const { time } = this.props;

        clearInterval(this.interval);

        this.setState({
            timeLeft: time * 10,
            timerFinished: false,
        });

        this.interval = setInterval(() => {
            const { timeLeft } = this.state;
            this.props.onChange(timeLeft - 1);

            if (timeLeft <= 0) {
                this.setState({ timerFinished: true });
                clearInterval(this.interval);
                this.props.onFinish();
            }
            else {
                this.setState({ timeLeft: timeLeft - 1 });
            }
        }, 100);
    }

    /**
     * Stops the timer and sets the time left to 0.
     */
    stop() {
        clearInterval(this.interval);
        this.setState({ timeLeft: 0 });
    }
    
    componentWillUnmount = () => clearInterval(this.interval);

    render() {
        const { timeLeft, time } = this.state;
        const delta = timeLeft / time;
        const variant = delta >= 0.5 ? 'success' : delta >= 0.2 ? 'warning' : 'danger';

        return <ProgressBar now={timeLeft} max={time} variant={variant}/>;
    }
}

export default TimerComponent;