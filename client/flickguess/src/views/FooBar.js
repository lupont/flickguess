import React, { Component } from 'react';

import SpotifyPlayer from 'react-spotify-web-playback';

class FooBar extends Component {
    state = {
        foo: 'Bar',
        func: function() {
            alert('hello');
        },
    };

    updateFoo() {
        // This call updates the 'foo' prop on state,
        // but leaves other props in their previous
        // state - in this case 'func'.
        this.setState({ 
            foo: 'Baz' ,
        });
    }

    render() {
        // Note: the .bind(this) statement on line 37 is
        // necessary to make sure the method has access to
        // the correct 'this' instance.

        return (
            <div>

                <SpotifyPlayer
                    token='BQBSE6SDI4kDCBukaETP5vCwsXho21f3EgC0mGQ7xXJp9cIQ4Td-6NKo-S5ziVYl7JEb0iaklDnPrzEhbs0l720csEn5ktjx9BB40RycQm_0wvC-0H_a4yyOylWzYquHNCunzIaxvS7rKPOCLAJIrzYXdwjCYAZWYlI'
                    uris={['spotify:track:1n8NKQRg8LVHy7oUhUgbFF']}/>
                <h1>
                    Rubrik
                </h1>

                <button onClick={this.updateFoo.bind(this)}>
                    Update state
                </button>

                <p>
                    {this.state.foo}
                </p>
            </div>
        );
    }
}

export default FooBar;