interface ServerStatusModel {
    is_online: boolean;
    index: number;
    last_status_check: number;
    last_data_fetch: number;
    character_count: number;
    lfm_count: number;
}

interface ServerStatusAggregateModel {
    argonnessen: ServerStatusModel;
    cannith: ServerStatusModel;
    ghallanda: ServerStatusModel;
    khyber: ServerStatusModel;
    orien: ServerStatusModel;
    sarlona: ServerStatusModel;
    thelanis: ServerStatusModel;
    wayfinder: ServerStatusModel;
    hardcore: ServerStatusModel;
}

interface GameStatusModel {
    last_data_fetch?: number;
    servers: ServerStatusAggregateModel;
}

export type { GameStatusModel, ServerStatusAggregateModel, ServerStatusModel };