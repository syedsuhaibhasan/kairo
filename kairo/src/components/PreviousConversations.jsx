import {config as DBService} from '../supabase/config';

function PreviousConversations(){
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
             try{
            const fetchedConversations = await DBService.getPreviousConversations();
            if(fetchedConversations){ // Check if fetchedConversations is not null or undefined
                setConversations(fetchedConversations);
            }
        }catch(error){
            console.log("PreviousConversations :: useEffect :: error :: ", error);
        }
    };
    fetchConversations();
    }, [conversations])

    return(
        <>
            
        </>
    )
}