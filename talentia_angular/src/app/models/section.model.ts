export interface ISection {
    headerTitle: string;
    items: ISubsection[];
}


export interface ISubsection {
    title: string;
    url: string;
    videoTiming?: string;
}
