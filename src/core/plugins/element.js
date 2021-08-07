import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Link,
    Notification,
    Select,
    Option,
    Container,
    Aside,
    Main,
    Header,
    Menu,
    MenuItem,
    Submenu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Table,
    TableColumn,
    Pagination,
    Row,
    Col,
    Icon,
    Dialog,
    MessageBox,
    DatePicker,
    Tag
} from "element-ui";

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Link)
Vue.use(Select)
Vue.use(Option)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Tag)

Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
