package jerror

type Error struct {
	ErrString string
}

func (e *Error) Error() string {
	return e.ErrString
}

func Wrap(err error, str string) error {
	if err == nil {
		return nil
	}
	e := &Error{
		ErrString: str + " -> " + err.Error(),
	}
	return e
}

func New(str string) *Error {
	e := &Error{ErrString: str}
	return e
}
