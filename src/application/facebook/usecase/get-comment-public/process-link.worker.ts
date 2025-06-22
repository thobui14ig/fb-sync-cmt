
import axios from 'axios';
import { decodeCommentId, extractPhoneNumber, getHttpAgent } from 'src/common/utils/helper';
import { parentPort, workerData } from 'worker_threads';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

async function handleDataComment(response) {
    const comment =
        response?.data?.data?.node?.comment_rendering_instance_for_feed_location
            ?.comments.edges?.[0]?.node;
    if (!comment) return null
    const commentId = decodeCommentId(comment?.id) ?? comment?.id

    const commentMessage =
        comment?.preferred_body && comment?.preferred_body?.text
            ? comment?.preferred_body?.text
            : 'Sticker';

    const phoneNumber = extractPhoneNumber(commentMessage);
    const userNameComment = comment?.author?.name;
    const commentCreatedAt = dayjs(comment?.created_time * 1000).utc().format('YYYY-MM-DD HH:mm:ss');
    const serialized = comment?.discoverable_identity_badges_web?.[0]?.serialized;
    let userIdComment = serialized ? JSON.parse(serialized).actor_id : comment?.author.id
    const totalCount = response?.data?.data?.node?.comment_rendering_instance_for_feed_location?.comments?.total_count
    const totalLike = response?.data?.data?.node?.comment_rendering_instance_for_feed_location?.comments?.count
    userIdComment = userIdComment

    return {
        commentId,
        userNameComment,
        commentMessage,
        phoneNumber,
        userIdComment,
        commentCreatedAt,
        totalCount,
        totalLike
    };
}

async function main({ headers, body, proxy }) {
    const httpsAgent = getHttpAgent(proxy)

    try {
        return axios.post('https://www.facebook.com/api/graphql', body, {
            headers, httpsAgent
        }).then(async (res) => {
            let dataComment = await handleDataComment(res)
            console.log("🚀 ~ main ~ dataComment:", dataComment)

            parentPort?.postMessage(dataComment);
        })
    } catch (error) {
        parentPort?.postMessage(null);
    }
}

// Worker nhận dữ liệu đầu vào từ workerData
main(workerData).then(result => {
    // parentPort?.postMessage(result); // Gửi kết quả về thread cha
}).catch(err => {
    parentPort?.postMessage({ success: false, error: err.message });
});


