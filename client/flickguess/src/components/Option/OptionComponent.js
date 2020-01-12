import React, { Component } from 'react';

class OptionComponent extends Component {

    //Deselecting all other options and selecting this
    select() {
        let elems = document.getElementsByClassName('option');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('gray-border');
        }
        if (!this.props.missedAnswer) {
            let elem = document.getElementById(this.props.poster);
            elem.classList.add('gray-border');
            this.props.onClick();
        }
    }

    render() {
        const { imageData } = this.props;
        
        //Find poster url in imageData
        let source;
        for (let i = 0; i < imageData.length; i++) {
            if (imageData[i].id === this.props.poster) {
                source = imageData[i].poster;
                break;
            }
        }
        return(
            <div
                id={this.props.poster}
                 className={this.props.className}
                 onClick={() => this.select()}
            >
                <img src={source} alt='movie poster' className='optionImage'/>
                <p className='optionText'>{this.props.title}</p>
            </div>
        );
    }
}

export default OptionComponent;