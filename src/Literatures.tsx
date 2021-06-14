import React, {ChangeEvent} from 'react';
import {LiteratureEntry, SortCriteria} from './types';
import List from './components/List';
import MultiChoices from './components/MultiChoices';
import Nbsp from './components/Nbsp';
import _ from 'lodash';
import ScrollToTop from 'react-scroll-to-top';

interface LiteraturesProp {
    title: string,
    description: string,
    entries: LiteratureEntry[];
    listHeader: string | null,

    enableSearch: boolean;
    enableFilter: boolean;
    enableSort: boolean;
    enableScrollTopButton: boolean;

    defaultSortCriterion: SortCriteria;
    defaultReverse: boolean;
}

interface LiteraturesState {
    // filtering
    searchPayload: string
    sortCriterion: SortCriteria;
    reverse: boolean;
    venues: string[];
    years: string[];
    tags: string[];

    // status quo
    allVenues: string[];
    allTags: string[];
    allYears: string[];
}

export class Literatures extends React.Component<LiteraturesProp, LiteraturesState> {
    static defaultProps = {
        listHeader: 'Literature:',
        enableSearch: false,
        enableFilter: false,
        enableSort: false,
        defaultSortCriterion: 'title' as SortCriteria,
        defaultReverse: false,
        enableScrollTopButton: false,
    };

    constructor(prop: LiteraturesProp) {
        super(prop);

        const allVenues = _.uniqWith(this.props.entries.filter(e => e.venueShort).map(e => e.venueShort as string), (a, b) => a.toLowerCase() === b.toLowerCase()).sort();
        allVenues.push('No Venue');
        const allYears = _.uniq(this.props.entries.filter(e => e.date).map(e => (e.date as Date).getFullYear())).sort((a, b) => a > b ? -1 : a === b ? 0 : 1).map(d => d.toString());
        allYears.push('No Year');
        const allTags = _.uniqWith(this.props.entries.reduce((previousValue, currentValue) => {
            previousValue.push(...currentValue.tags);
            return previousValue;
        }, [] as string[]), (a, b) => a.toLowerCase() === b.toLowerCase())
            .sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() === b.toLowerCase() ? 0 : 1);
        allTags.push('No Tag');

        this.state = {
            searchPayload: '',
            sortCriterion: this.props.defaultSortCriterion,
            reverse: this.props.defaultReverse,
            venues: allVenues,
            years: allYears,
            tags: allTags,

            allTags,
            allYears,
            allVenues,
        };

        this.onSearchBoxChange = this.onSearchBoxChange.bind(this);
        this.onSortCriterionChange = this.onSortCriterionChange.bind(this);
        this.onReverseChange = this.onReverseChange.bind(this);
        this.onFilterChoicesChange = this.onFilterChoicesChange.bind(this);
    }

    get searchKeywords(): string[] {
        if (this.state.searchPayload.length === 0) return [];

        return this.state.searchPayload.trim()
            .split(' ')
            .filter(s => s.length > 0)
            .map(k => k.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));// $& means the whole matched string
    }

    get visibleEntries(): LiteratureEntry[] {
        const result: LiteratureEntry[] = [];

        for (const entry of this.props.entries) {
            if ((this.state.years.includes('No Year') && !entry.date || entry.date && this.state.years.includes(entry.date.getFullYear().toString())) && // year match
                (this.state.tags.includes('No Tag') && entry.tags.length <= 0 || entry.tags.length > 0 && entry.tags.some(v => this.state.tags.map(t => t.toLowerCase()).includes(v.toLowerCase()))) && // tag match
                (this.state.venues.includes('No Venue') && !entry.venueShort || entry.venueShort && this.state.venues.includes(entry.venueShort)) && // venue match
                (this.searchKeywords.length === 0 || this.calSimilarity(entry) > 0) // if there is search keywords, similarity > 0
            ) {
                result.push(entry);
            }
        }

        return result.sort((a, b) => {
            let flag: number;
            switch (this.state.sortCriterion) {
            case 'venue':
                if (!a.venueShort) flag = -1;
                else if (!b.venueShort) flag = 1;
                else flag = a.venueShort < b.venueShort ? -1 : 1;
                break;
            case 'author':
                flag = a.authors.map(au => `${au.firstName} ${au.lastName}`).join(',') < b.authors.map(au => `${au.firstName} ${au.lastName}`).join(',') ? -1 : 1;
                break;
            case 'title':
                flag = a.title < b.title ? -1 : 1;
                break;
            case 'date':
                if (!a.date) flag = -1;
                else if (!b.date) flag = 1;
                else flag = a.date < b.date ? -1 : 1;
                break;
            case 'similarity':
                flag = this.calSimilarity(a) < this.calSimilarity(b) ? -1 : 1;
                break;
            default:
                flag = 0;
            }
            return this.state.reverse ? -flag : flag;
        });
    }

    /**
     * Calculate the similarity between this.searchKeywords and the given entry.
     *
     * @param entry
     * @private
     * @return the similarity [0,100]: the higher the more similar
     */
    private calSimilarity(entry: LiteratureEntry) {
        if (this.searchKeywords.length === 0) {
            return 100;
        }

        let sim = 0;
        const items = entry.title.split(/\s+/).concat(entry.authors.map(a => `${a.firstName} ${a.lastName}`).join(','));
        // let items = entry.title.split(/\s+/).concat(entry.authors).concat(entry.year).concat([entry.venue]);
        const index: number[][] = [];
        for (let j = 0; j < this.searchKeywords.length; j++) {
            index.push([]);
            for (let i = 0; i < items.length; i++) {
                if (items[i].toLowerCase() === this.searchKeywords[j].toLowerCase()) {
                    index[j].push(i);
                } else if (items[i].toLowerCase().indexOf(this.searchKeywords[j].toLowerCase()) >= 0) {
                    index[j].push(i + 0.5);
                }
            }
        }
        let s;
        index[0].forEach((item) => {
            s = 100;
            let sub = 0;
            for (let i = 1; i < index.length; i++) {
                if (index[i].length === 0) {
                    sub += 1;
                }
                if (index[i].indexOf(item + i) < 0) {
                    // title not consecutive
                    s = 80;
                }
            }
            if (sub > 0) {
                s = 60;
            }
            s = s - sub;
            if (s > sim) {
                sim = s;
            }
        });
        return sim;
    }

    onSearchBoxChange(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.id === 'searchTextBox') {
            this.setState({searchPayload: event.target.value});
        }
    }

    onSortCriterionChange(criterion: SortCriteria): void {
        this.setState({sortCriterion: criterion});
    }

    onReverseChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({reverse: event.target.checked});
    }

    onFilterChoicesChange(name: 'tag' | 'date' | 'venue', selected: string[]): void {
        switch (name) {
        case 'tag':
            this.setState({tags: selected});
            break;
        case 'date':
            this.setState({years: selected});
            break;
        case 'venue':
            this.setState({venues: selected});
            break;
        }
    }

    render(): JSX.Element {
        const search = <div>
            <h2>Search:</h2>
            <div className="form-group">
                <label htmlFor="searchTextBox" className="font-weight-bold">Keywords:</label>
                <input type="text" className="form-control" id="searchTextBox" aria-describedby="searchHelp"
                    placeholder="Search Paper by Keyword in Title and Author" value={this.state.searchPayload}
                    onChange={this.onSearchBoxChange}/>
                <small id="searchHelp" className="form-text text-muted">
                    Search papers by keywords. Keywords should be separated by blank space.
                </small>
            </div>
            <hr/>
        </div>;

        const filter = <div>
            <h2>Filter:</h2>
            {
                this.state.allVenues.length > 0 ?
                    <MultiChoices name="Venue" choices={this.state.allVenues}
                        onChoicesChanged={(selected => this.onFilterChoicesChange('venue', selected))}/> :
                    null
            }
            {
                this.state.allYears.length > 0 ?
                    <MultiChoices name="Year" choices={this.state.allYears}
                        onChoicesChanged={(selected => this.onFilterChoicesChange('date', selected))}/> :
                    null
            }
            {
                this.state.allTags.length > 0 ?
                    <MultiChoices name="Tags" choices={this.state.allTags}
                        onChoicesChanged={(selected => this.onFilterChoicesChange('tag', selected))}/> :
                    null
            }
            <hr/>
        </div>;

        const sort = <div>
            <h2>Sort:</h2>
            <span>Sorted By: </span>
            <div className="btn-group" role="group" aria-label="sortBy">
                <button type="button"
                    className={`btn btn-sm ${this.state.sortCriterion === 'title' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => this.onSortCriterionChange('title')}>Title
                </button>
                <button type="button"
                    className={`btn btn-sm ${this.state.sortCriterion === 'venue' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => this.onSortCriterionChange('venue')}>Venue
                </button>
                <button type="button"
                    className={`btn btn-sm ${this.state.sortCriterion === 'author' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => this.onSortCriterionChange('author')}>Author
                </button>
                <button type="button"
                    className={`btn btn-sm ${this.state.sortCriterion === 'date' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => this.onSortCriterionChange('date')}>Date
                </button>
                <button type="button"
                    className={`btn btn-sm ${this.state.sortCriterion === 'similarity' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => this.onSortCriterionChange('similarity')}>Similarity
                </button>
            </div>
            <Nbsp/>
            <div className="ml-3 form-check-inline align-middle">
                <label className="form-check-label">
                    <input type="checkbox" className="form-check-input" checked={this.state.reverse}
                        onChange={this.onReverseChange}/>
                    <Nbsp/>
                    reverse order
                </label>
            </div>
            <hr/>
        </div>;

        return (
            <div>
                <h1>{this.props.title}</h1>
                <p>{this.props.description}</p>
                <hr/>

                {this.props.enableSearch && search}
                {this.props.enableFilter && filter}
                {this.props.enableSort && sort}

                {this.props.listHeader ? <h2>{this.props.listHeader}</h2> : null}
                <List entryList={this.visibleEntries} highlights={this.searchKeywords}/>

                {this.props.enableScrollTopButton && <ScrollToTop/>}
            </div>

        );
    }
}
