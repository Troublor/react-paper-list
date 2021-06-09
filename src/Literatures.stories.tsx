import React from 'react';
import {Literatures} from './Literatures';

export default {
    title: 'Literatures'
};

export const Primary = (): JSX.Element => <Literatures title={'Paper List'} description={'Literature Paper List'} enableSearch enableFilter enableSort entries={[
    {
        id: '1',
        title: 'This is the title of the paper',
        date: new Date(2020),
        type: 'Conference Paper',
        authors: [
            {
                firstName: 'Wuqi Aaron',
                lastName: 'Zhang',
            }
        ],
        venue: 'Full venue',
        venueShort: 'avenue',
        tags: ['tag 1', 'sdf'],
        awards: ['Distinguished Paper'],

        paperUrl: 'https://baidu.com',
        abstract: `
        Decentralized cryptocurrencies feature the use of blockchain to transfer values among peers on networks without central agency. 
        Smart contracts are programs running on top of the blockchain consensus protocol to enable people make agreements while minimizing trusts. Millions of smart contracts have been deployed in various decentralized applications. The security vulnerabilities within those smart contracts pose significant threats to their applications. Indeed, many critical security vulnerabilities within smart contracts on Ethereum platform have caused huge financial losses to their users. In this work, we present ContractFuzzer, a novel fuzzer to test Ethereum smart contracts for security vulnerabilities. ContractFuzzer generates fuzzing inputs based on the ABI specifications of smart contracts, defines test oracles to detect security vulnerabilities, instruments the EVM to log smart contracts runtime behaviors, and analyzes these logs to report security vulnerabilities. Our fuzzing of 6991 smart contracts has flagged more than 459 vulnerabilities with high precision. In particular, our fuzzing tool successfully detects the vulnerability of the DAO contract that leads to $60 million loss and the vulnerabilities of Parity Wallet that have led to the loss of $30 million and the freezing of $150 million worth of Ether.
        `,
        bibtex: ` 
@article{authorEmpiricalEvaluationSmart2021,
  title = {Empirical {{Evaluation}} of {{Smart Contract Testing}}:  {{What}} Is the {{Best Choice}}?},
  author = {Author, Anonymous},
  year = {2021},
  pages = {11},
  file = {/home/troublor/Zotero/storage/RQNU3IHS/my-review.docx;/home/troublor/Zotero/storage/YHPP6TZS/final-review.docx;/home/troublor/Zotero/storage/ZNJTUGQI/Author - 2021 - Empirical Evaluation of Smart Contract Testing  W.pdf},
  journal = {ISSTA 2021},
  language = {en}
}`,
        projectUrl: '',
        slidesUrl: 'https://google.com',
    },
    {
        id: '2',
        title: 'This is the title of a paper',
        date: new Date(),
        type: 'Conference Paper',
        authors: [
            {
                firstName: 'Wuqi Aaron',
                lastName: 'Zhang',
            }
        ],
        venue: 'Full venue',
        venueShort: 've',
        tags: ['Tag 1'],
        awards: ['Distinguished Paper'],

        paperUrl: '',
        abstract: 'abstract',
        bibtex: 'bibtex',
        projectUrl: 'https://google.com',
        slidesUrl: null,
    }
]} />;