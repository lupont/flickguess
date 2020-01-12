import React, { Component } from 'react';

class OptionComponent extends Component {
    state = {
        selectClass: '',
        id: '',
        imageData: [],
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { poster, imageData } = this.props;
        this.setState({ 
            id: poster,
            imageData,
        });
    }

    select() {
        let elems = document.getElementsByClassName('option');

        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }
        
        let elem = document.getElementById(this.state.id);
        elem.classList.add('gray-border');
        this.props.onClick();
    }

    render() {
        // let source;
        const { imageData, id: poster } = this.state;
        const source = imageData && imageData.find(data => data.id === poster);

        // for (let i = 0; i < imageData.length; i++) {
        //     if (imageData[i].id == poster) {
        //         source = imageData[i].poster;
        //     }
        // }

        return (
            <div id={this.props.poster} className={this.props.className} onClick={() => this.select()}>
                <img src={source} alt='movie poster' className='optionImage'/>
                <p className='optionText'>{this.props.title}</p>
            </div>
        );
    }
}

export default OptionComponent;