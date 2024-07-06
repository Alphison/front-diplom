export interface CourseType{
    id?: number;
    name: string;
    description: string;
    duration: string;
    user_id: number;
    category_id: number;
    profession: string;
    img_course?: string;
    goal: string;
    price: number;
    active: string;
    created_at?: Date;
}

export interface CategoryType{
    id?: number;
    name: string;
    created_at?: Date;
    courses?: CourseType[];
}

type VideosType = {
    id: number;
    video: string;
    lesson_id: number;
    created_at?: Date;
}

type ImagesType = {
    id: number;
    img: string;
    lesson_id: number;
    created_at?: Date;
}

export interface LessonType{
    id?:number;
    name: string;
    description: string;
    course_id: number;
    preview?: string;
    task: string;
    images?: [ImagesType];
    videos?: [VideosType];
}

export interface CourseUserBody{
    course_id: number | undefined;
    user_id: number | undefined;
}

export interface LessonUserBody{
    lesson_id: number | undefined;
    user_id: number | undefined;
}

export interface CommentBody{
    id?: number;
    text: string;
    user_id: number;
    lesson_id: number;
    created_at: string | any;
}

export interface AnswerBody{
    id?: number;
    text: string;
    user_id: number;
    comment_id: number;
    created_at: string | any;
}