import React, { Component } from 'react';

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
        // Note: the .bind(this) statement on line 31 is
        // necessary to make sure the method has access to
        // the correct 'this' instance.

        return (
            <div>
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