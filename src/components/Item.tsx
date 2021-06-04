import React from 'react';
import {LiteratureEntry} from '../types';
import {BsAwardFill} from 'react-icons/all';
import {OverlayTrigger, Popover} from 'react-bootstrap';

interface ItemProp {
    entry: LiteratureEntry // the literature entry
    highlights: string[], // the list of strings which should be highlighted 
}

export default class Item extends React.Component<ItemProp, never> {

    get title(): string {
        return this.props.entry.title;
    }

    get authors(): string {
        return this.props.entry.authors
            .map(author => `${author.firstName} ${author.lastName}`)
            .join(', ');
    }

    get venue(): string | null {
        return this.props.entry.venue;
    }

    get year(): string | number {
        return this.props.entry.date ? this.props.entry.date.getFullYear() : 'No Year';
    }

    get tags(): string[] {
        return this.props.entry.tags;
    }

    private highlight(payload: string): JSX.Element | null {
        if (this.props.highlights.length === 0) {
            return <span>{payload}</span>;
        }
        const reg = new RegExp('^(.*?)(' + this.props.highlights.join('|') + ')(.*)$', 'i');
        const matches = reg[Symbol.match](payload);
        if (!matches) {
            return <span>{payload}</span>;
        }
        return <span>
            {matches[1]}
            <span style={{backgroundColor: '#8ca0f754'}}>{matches[2]}</span>
            {this.highlight(matches[3])?.props.children}
        </span>;
    }

    render(): JSX.Element {
        const title = this.highlight(this.title);

        const tags = this.tags.map((tag) =>
            <span className="badge bg-primary me-1" key={`${this.props.entry.id}-tag-${tag}`}>{tag}</span>);

        const awards = this.props.entry.awards.map(award =>
            <span className="me-1" key={`${this.props.entry.id}-${award}`}><BsAwardFill
                color={'#de9a00'}/> {award}</span>);

        const popover =(body: string, header?: string)=> (
            <Popover id="popover-basic">
                {header && <Popover.Header as="h3">{header}</Popover.Header>}
                <Popover.Body>
                    {body}
                </Popover.Body>
            </Popover>
        );

        const paperUrl = this.props.entry.url ?
            <a href={this.props.entry.url} target="_blank" rel="noreferrer">
                <button className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>Paper</button>
            </a> :
            null;
        const bibtex = this.props.entry.bibtex ?
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover(this.props.entry.bibtex)}>
                <button type="button" className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>BibTex</button>
            </OverlayTrigger>
            :
            null;
        const abstract = this.props.entry.abstract ?
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover(this.props.entry.abstract)}>
                <button type="button" className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>Abstract</button>
            </OverlayTrigger> :
            null;
        const project = this.props.entry.project ?
            <a href={this.props.entry.project} target="_blank" rel="noreferrer">
                <button className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>Project</button>
            </a> :
            null;

        return (
            <div className="d-flex">
                <div className="fw-bold" style={{width: '75px', wordWrap: 'break-word'}}>
                    <div>{this.props.entry.venueShort}</div>
                    <div>{this.year}</div>
                </div>
                <div className="flex-grow-1 text-start">
                    <span className="fw-bold">{title}</span>
                    <ul style={{paddingLeft: '15px', marginBottom: 0}}>
                        <li>{this.highlight(this.authors)}</li>
                        <li><span>{this.venue}</span></li>
                    </ul>
                    {awards.length > 0 && awards}
                    <div className="mb-1">{tags}</div>
                    <div>{paperUrl}{abstract}{bibtex}{project}</div>
                </div>
            </div>
        );
    }
}