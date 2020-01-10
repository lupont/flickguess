import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './TimerComponent.css';

class TimerComponent extends Component {
    state = {
        timeLeft: -1,
        time: -1,
    };

    componentDidMount() {
        const { time } = this.props;
        this.setState({
            time: time * 10,
            timeLeft: time * 10,
        });

        this.interval = setInterval(() => {
            const { timeLeft } = this.state;

            if (timeLeft <= 0) {
                this.setState({ 
                    timerFinished: true,
                });
                clearInterval(this.interval);
                this.props.onFinish();
            }
            else {
                this.setState({ timeLeft: timeLeft - 1 });
                this.props.onChange(timeLeft - 1);
            }
        }, 100);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

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