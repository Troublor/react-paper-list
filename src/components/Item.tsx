import React from 'react';
import {LiteratureEntry} from '../types';
import {BsAwardFill} from 'react-icons/all';
import {Card} from 'react-bootstrap';
import {CopyBlock} from 'react-code-blocks';

interface ItemProp {
    entry: LiteratureEntry // the literature entry
    highlights: string[], // the list of strings which should be highlighted
}

interface ItemState {
    showBibtex: boolean;
    showAbstract: boolean;
}

export default class Item extends React.Component<ItemProp, ItemState> {
    constructor(prop: ItemProp) {
        super(prop);

        this.state = {
            showAbstract: false,
            showBibtex: false,
        };
    }

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

        const paperUrl = this.props.entry.paperUrl ?
            <a href={this.props.entry.paperUrl} target="_blank" rel="noreferrer">
                <button className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>Paper
                </button>
            </a> :
            null;
        const bibtex = this.props.entry.bibtex ?
            <button type="button" className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}} onClick={
                () => this.setState({showBibtex: !this.state.showBibtex})
            }>BibTex
            </button> :
            null;
        const abstract = this.props.entry.abstract ?
            <button className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}} onClick={
                () => this.setState({showAbstract: !this.state.showAbstract})
            }>Abstract</button> :
            null;
        const project = this.props.entry.projectUrl ?
            <a href={this.props.entry.projectUrl} target="_blank" rel="noreferrer">
                <button className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>Project</button>
            </a> :
            null;

        const abstractCard = this.state.showAbstract && this.props.entry.abstract ?
            <Card body className={'text-start'}>
                <p className={'fw-bold'}>Abstract:</p>
                {this.props.entry.abstract}
            </Card> : null;
        const bibtexCard = this.state.showBibtex && this.props.entry.bibtex ?
            <Card body className={'text-start'}>
                <p className={'fw-bold'}>BibTex:</p>
                <CopyBlock text={this.props.entry.bibtex} showLineNumbers={false} language={'tex'}
                    theme={'atomOneLight'} codeBlock/>
            </Card> : null;

        const slidesUrl = this.props.entry.slidesUrl ?
            <a href={this.props.entry.slidesUrl} target="_blank" rel="noreferrer">
                <button className="me-1 btn btn-sm btn-outline-primary" style={{padding: '0.1rem'}}>Slides</button>
            </a> :
            null;

        return (
            <div className="mb-3">
                <div className="d-flex mb-1">
                    <div className="fw-bold me-2" style={{width: '100px', overflowWrap: 'anywhere', display: 'table', fontSize: 'large'}}>
                        <div>{this.props.entry.venueShort}</div>
                        <div>{this.year}</div>
                    </div>
                    <div className="flex-grow-1 text-start" style={{display: 'table'}}>
                        <span className="fw-bold" style={{fontSize: 'large'}}>{title}</span>
                        <ul style={{paddingLeft: '15px', marginBottom: 0}}>
                            <li>{this.highlight(this.authors)}</li>
                            <li><span>{this.venue}</span></li>
                        </ul>
                        {awards.length > 0 && awards}
                        <div className="mb-1">{tags}</div>
                        <div>{paperUrl}{abstract}{slidesUrl}{project}{bibtex}</div>
                    </div>
                </div>
                {abstractCard}
                {bibtexCard}
            </div>
        );
    }
}