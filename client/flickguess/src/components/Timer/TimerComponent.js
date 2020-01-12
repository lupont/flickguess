import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './TimerComponent.css';

class TimerComponent extends Component {
    state = {
        timeLeft: -1,
        time: -1,
        timerFinished: false,
    };

    componentDidMount() {
        this.restart();
        this.setState({ time: this.props.time * 10 });
    }

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
    
    componentWillUnmount = () => clearInterval(this.interval);

    render() {
        const { timeLeft, time, timerFinished } = this.state;
        const delta = timeLeft / time;
        const variant = delta >= 0.5 ? 'success' : delta >= 0.2 ? 'warning' : 'danger';

        return (
            <div>
                {timerFinished ? (
                    <p>Finished</p>
                ) : (
                    <p>{timeLeft} / {time} ({timeLeft / time})</p>
                )}

                <ProgressBar now={timeLeft} max={time} variant={variant}/>
            </div>
        );
    }
}

export default TimerComponent;