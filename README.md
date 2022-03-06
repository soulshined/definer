Definer is a proxy utility for communicating with dictionaryapi.com to quickly define word[s] in your prefered CLI, primarly as a TUI (Text User Interface).

Simply install, add your api key and start defining!

1) ```> npm install -g node-definer```

2) ```> node-definer --setup```

3)  ```
    > node-definer onomatopoeia

    onomatopoeia ⌜noun⌟ ⨳ on*o*mato*poe*ia
    pronounced: ˌä-nə-ˌmä-tə-ˈpē-ə
    / onomatopoeia; onomatopoeias; onomatopoeic; onomatopoeically; onomatopoetic; onomatopoetically /
    ∘ the naming of a thing or action by a vocal imitation of the sound associated with it (such as buzz, hiss); also : a word formed by onomatopoeia
    ∘ the use of words whose sound suggests the sense

    ? Select an option for more info or press CTRL+C to quit
    (Use arrow keys)
    > speak
    ```

There are 3 possible actions to execute after defining a word:

- `speak`: plays the pronounciation in your default browser
- `synonyms`: displays a list of synonyms
- `antonyms`: displays a list of antonyms

> Note: synonyms and antonyms are only provided if you also include a thesaurus api key during setup

Your requests are cached in a sqlite database so that you don't exhaust your api quota on requests you've made in the past

## Programatically define words

Though this package is intended to be largely used via a CLI, there is some minimal support for importing a Definer class to define words.

The difference in the lightweight class support is that it will only return the response matches as-is, if any. It will not pretty format anything and it will also not include thesaurus support, even if you provide an api key in the CLI setup.

This is intentional, because often most defined words have multiple meanings, or matches, so it's uncertain which one[s] you need synonyms/antonyms for.

There is no need to perpetually exhaust your api quota limit to retrieve them all for 'just-in-case'

An example:

```js
const Definer = require('node-definer');

const definer = new Definer('<collegiate api key>');

definer.define('onomatopoeia')
       .then(matches => console.log(matches[0]))
       .catch(console.log);

//logs
ApiResponseMatch {
  headwordinfo: ApiResponseMatchHeadwordInfo {
    headword: 'on*o*mato*poe*ia',
    pronounciations: [
      [ApiResponseMatchPronounciation],
      [ApiResponseMatchPronounciation]
    ],
    alternates: []
  },
  labels: ApiResponseMatchLabels {
    functional: 'noun',
    general: [],
    parenthesized: null
  },
  definitions: ApiReponseMatchDefinition {
    shortdefs: [
      'the naming of a thing or action by a vocal imitation of the sound associated with it (such as buzz, hiss); also : a word formed by onomatopoeia',
      'the use of words whose sound suggests the sense'
    ]
  },
  id: 'onomatopoeia',
  query: 'onomatopoeia',
  uuid: '32bb5182-d079-4291-aff2-c3ad25b3779f',
  stems: [
    'onomatopoeia',
    'onomatopoeias',
    'onomatopoeic',
    'onomatopoeically',
    'onomatopoetic',
    'onomatopoetically'
  ],
  date: 'circa 1553{ds||1||}'
}
```


