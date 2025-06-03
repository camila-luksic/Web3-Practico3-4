type CardProps = {
    title: string;
    children: React.ReactNode;
    titleAlign?: 'left' | 'center' | 'right';
    className?: string;
  
}

export const Card = ({ title, children,  titleAlign = 'left',className }: CardProps) => {
   const titleStyle = { textAlign: titleAlign };
    return (
        <div className={`rounded-xl overflow-hidden shadow-sm bg-white ${className}`}>
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800" style={titleStyle}>{title}</h2>
                <div className="text-gray-600 mt-2">{children}</div>
            </div>
        </div>
    );
}