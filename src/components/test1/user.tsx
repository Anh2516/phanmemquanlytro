type userProps = {
    name : string;
    age : number;
};
function user({name,age}: userProps) {
    return (
        <>
            <h2>{name}</h2>
            <p> {age}</p>
        
        </>
    );

};
export default user;