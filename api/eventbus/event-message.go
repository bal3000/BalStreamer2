package eventbus

type EventMessage interface {
	TransformMessage() ([]byte, string, error)
}
