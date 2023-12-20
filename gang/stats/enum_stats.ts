
export enum CombatStats {
    Strength = "str",
    Defense = "def",
    Dexterity = "dex",
    Agility = "agi",
}

export enum HackingStats {
    Hacking = "hack"
}

export enum CharismaStats {
    Charisma = "cha"
}

export type Stats = CombatStats | HackingStats | CharismaStats