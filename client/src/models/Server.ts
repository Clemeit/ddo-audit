interface ServerInfo {
    index?: number;
    created?: string;
    last_status_check?: string;
    last_data_fetch?: string;
    creation_timestamp?: string;
    is_online?: boolean;
    character_count?: number;
    lfm_count?: number;
    queue_number?: number;
    is_vip_only?: boolean;
}

interface ServerInfoApiServersModel {
    [key: string]: ServerInfo;
}

interface ServerInfoApiDataModel {
    servers: ServerInfoApiServersModel;
}

interface ServerInfoApiModel {
    data: ServerInfoApiDataModel;
}