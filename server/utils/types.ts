import { PageObjectResponse, DatabaseObjectResponse, PartialPageObjectResponse, PartialDatabaseObjectResponse } from '@notionhq/client'


export type NotionResponse = PageObjectResponse | PartialPageObjectResponse | DatabaseObjectResponse | PartialDatabaseObjectResponse
