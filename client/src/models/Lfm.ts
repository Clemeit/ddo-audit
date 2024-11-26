interface QuestLevel {
    heroic_normal: number;
    heroic_hard: number;
    heroic_elite: number;
    epic_normal: number;
    epic_hard: number;
    epic_elite: number;
}

interface QuestXP {
    heroic_normal: number;
    heroic_hard: number;
    heroic_elite: number;
    epic_normal: number;
    epic_hard: number;
    epic_elite: number;
}

interface Quest {
    id: string;
    alt_id: string;
    area_id: string;
    name: string;
    level: QuestLevel;
    xp: QuestXP;
    is_free_to_play: boolean;
    is_free_to_vip: boolean;
    required_adventure_pack: string;
    adventure_area: string;
    quest_journal_group: string;
    group_size: string;
    patron: string;
    average_time: number;
    tip: string;
}

interface LfmActivityEvent {
    tag: string;
    data: string;
}

interface LfmActivity {
    timestamp: string;
    events: LfmActivityEvent[];
}

interface Lfm {
    id: string;
    comment: string;
    quest: Quest;
    is_quest_guess: boolean;
    difficulty: string;
    accepted_classes: string[];
    accepted_classes_count: number;
    minimum_level: number;
    maximum_level: number;
    adventure_active_time: number;
    leader: Character;
    members: Character[];
    activity: LfmActivity[];
    last_updated: string;
    server_name: string;
}

enum LfmActivityType {
    posted = "posted",
    comment = "comment",
    quest = "quest",
    member_joined = "member_joined",
    member_left = "member_left",
}

interface LfmApiServerModel {
    lfms: { [key: number]: Lfm };
    last_update: string;
}

interface LfmApiDataModel {
    argonnessen: LfmApiServerModel;
    cannith: LfmApiServerModel;
    ghallanda: LfmApiServerModel;
    khyber: LfmApiServerModel;
    orien: LfmApiServerModel;
    sarlona: LfmApiServerModel;
    thelanis: LfmApiServerModel;
    wayfinder: LfmApiServerModel;
    hardcore: LfmApiServerModel;
    cormyr: LfmApiServerModel;
}

interface LfmApiModel {
    data: LfmApiDataModel;
}