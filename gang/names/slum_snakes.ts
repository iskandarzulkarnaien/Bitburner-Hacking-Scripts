import { Name } from "/gang/names/name"
import { chanceToAppear, getRandomArrayElement } from "/lib/helpers"

class SlumSnakesName extends Name {
    static validFirstNames = []
    static validLastNames = []
    static validAdjectives = [
        "Pale", "Lecherous", "Venomous", "Vicious", "Devious",
        "Fanged", "Loathsome", "Treacherous", "Black", "Sly",
        "Deceitful"
    ]
    static validNouns = [
        "Krait", "Adder", "Asp", "Viper", "Boa",
        "Constrictor", "Diamondback", "Cottonmouth", "Sidewinder"
    ]

    firstName: string;
    adjective?: string;
    noun?: string;
    lastName?: string;

    constructor(firstName: string, adjective?: string, noun?: string, lastName?: string) {
        super()
        this.firstName = firstName
        this.adjective = adjective
        this.noun = noun
        this.lastName = lastName
    }

    static generate(): string {
        const firstName = getRandomArrayElement(SlumSnakesName.validFirstNames)
        const lastName = getRandomArrayElement(SlumSnakesName.validFirstNames)

        const adjective = getRandomArrayElement(SlumSnakesName.validAdjectives)
        const noun = getRandomArrayElement(SlumSnakesName.validNouns)

        const includeAdjective = Math.random() < 0.65  // Arbitrary value

        let title = "The";
        if (includeAdjective) title = `${title} ${adjective}`
        if (includeNoun) title = `${title} ${noun}`
        if (includeQuotes) title = "'" + title + "'"

        const includeLastName = includeAdjective ? Math.random() < 0.25 : Math.random() < 0.40  // Arbitrary value
        if (includeLastName) return `${firstName} ${title} ${lastName}`
        return `${firstName} ${title}`
    }

    protected constructName() {
        const parts = [this.firstName, this.adjective, this.noun, this.lastName]
        return parts.filter((part): part is string => !!part).join(' ')
    }

    /**
     * Slum Snake Gang Member Names are in form: `${name} the ${adjective} ${noun}`
     * asd
     */
        // 
    // E.g. Ivy the Sewer Krait
    private getInclusions() {
        // TODO: have list of feminine, masculine and neutral first names

        const includeAdjective = chanceToAppear('65%')
        const includeNoun = chanceToAppear('35%')
        const includeLastName = (includeAdjective && includeNoun) ? chanceToAppear('0%') : chanceToAppear('45%')
        const includeQuotes = !includeLastName
    }
}