class ApiResponseMatchPronounciationSound {
    constructor(prn_sound) {
        this.audio = prn_sound.audio;
        this.ref = prn_sound.ref || null;
        this.stat = +prn_sound.stat || null;

        let subdir = this.audio[0];
        if (this.audio.startsWith('bix')) subdir = 'bix';
        else if (this.audio.startsWith('gg')) subdir = 'gg';
        else if (/\d/.test(this.audio[0]) || /[^a-zA-Z0-9]/.test(this.audio[0])) subdir = 'number';

        this.uri = `https://media.merriam-webster.com/audio/prons/en/us/ogg/${subdir}/${this.audio}.ogg`;
    }
}

class ApiResponseMatchPronounciation {
    constructor(pronounciation) {
        this.pronounciation = pronounciation.mw;
        this.sound = null;
        if (pronounciation.sound)
            this.sound = new ApiResponseMatchPronounciationSound(pronounciation.sound);
    }
}

class ApiResponseMatchHeadwordInfo {
    constructor(match) {
        this.headword = match.hwi.hw;
        this.pronounciations = [];
        this.alternates = match.ahws || [];

        if (match.hwi.prs)
            this.pronounciations = match.hwi.prs.map(m => new ApiResponseMatchPronounciation(m))
    }
}

class ApiResponseMatchLabels {
    constructor(match) {
        this.functional = match.fl || '';
        this.general = match.lbs || [];
        this.parenthesized = match.hwi.psl || null;
    }
}

class ApiReponseMatchDefinition {
    constructor(match) {
        this.shortdefs = match.shortdef;
    }
}

class ApiResponseMatch {
    constructor(match) {
        this.headwordinfo = new ApiResponseMatchHeadwordInfo(match);
        this.labels = new ApiResponseMatchLabels(match);
        this.definitions = new ApiReponseMatchDefinition(match);
        this.id = match.meta.id;
        this.query = this.id.split(":", 1)[0];
        this.uuid = match.meta.uuid;
        this.stems = match.meta.stems || [];
        this.date = match.date || null;
    }

    get first_pronounciation() {
        if (this.headwordinfo.pronounciations.length === 0) return null;

        const ps = this.headwordinfo.pronounciations.filter(p => p.sound);
        return ps.length > 0 ? ps[0] : null;
    }

    toString() {
        let alternates = "";
        let pronounced = "";

        if (this.headwordinfo.pronounciations.length > 0)
            pronounced = `pronounced: ${this.headwordinfo.pronounciations[0].pronounciation}\n`;

        if (this.headwordinfo.alternates.length > 0)
            alternates = ` ⨳ (${this.headwordinfo.alternates.join(", ")}) `;

        const header = `${this.query} ⌜${this.labels.functional}⌟ ⨳ ${this.headwordinfo.headword}${alternates}`;
        const subheader = `${pronounced}/ ${this.stems.join("; ")} /`;
        const defs = this.definitions.shortdefs.map(e => ` ∘ ${e}`).join("\n");

        return `\n${header}\n${subheader}\n${defs}\n`;
    }
}

module.exports.ApiResponseMatch = ApiResponseMatch;