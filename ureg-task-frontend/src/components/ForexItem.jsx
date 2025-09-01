import { Card, Skeleton } from "antd"
export default function ForexItem(props) {
    const { title, content, skeleton } = props
    if (skeleton) {
        return (
            <Card size="small">
                <Skeleton active paragraph={{rows:1}} />
            </Card>
        )
    }
    return (
        <Card size="small" title={title}>
            {content}
        </Card>
    )
}