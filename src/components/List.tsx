import React from 'react';
import {LiteratureEntry} from '../types';
import Item from './Item';

interface ListProp {
    entryList: LiteratureEntry[] // the ordered list of literature entries to display
    highlights: string[];  // the list of strings which should be highlighted 
}

export default class List extends React.Component<ListProp, never> {
    render(): JSX.Element {
        const items = this.props.entryList
            .map(entry => <Item entry={entry} highlights={this.props.highlights} key={entry.id}/>);

        return (
            <div className={'text-center'}>
                {
                    this.props.entryList.length > 0 ?
                        items :
                        <div className="text-center">
                            Not Found
                        </div>
                }
            </div>
        );
    }
}