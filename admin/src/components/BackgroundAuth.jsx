const BackgroundAuth = ({element})=>{
    return <div className="auth-container">
        <div className="auth-left">
            <img src="/auth.jpg" alt="auth" />
        </div>
        <div className="auth-right">
                {element}
        </div>
    </div>
}
export default BackgroundAuth