import { AuthDatabaseDomain } from "./domains/auth/auth";
import { CommentsDatabaseDomain } from "./domains/comments/comments";
import { PostsDatabaseDomain } from "./domains/posts/posts";
import { SessionDatabaseDomain } from "./domains/session/session";
import { UsersDatabaseDomain } from "./domains/users/users";

export class Dbi {
    public static users = new UsersDatabaseDomain();
    public static auth = new AuthDatabaseDomain();
    public static session = new SessionDatabaseDomain();
    public static posts = new PostsDatabaseDomain();
    public static comments = new CommentsDatabaseDomain();
}
