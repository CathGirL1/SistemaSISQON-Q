 <div className="panel-info-left">
        <div className="panel-info-icon">{icon}</div>

        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="panel-info-actions">
        {secondaryText && (
          <button className="panel-secondary-btn">{secondaryText}</button>
        )}

        {primaryText && (
          <button className="panel-primary-btn">{primaryText}</button>
        )}
      </div>
    </div>
  );
}